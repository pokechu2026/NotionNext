import BLOG from '@/blog.config'
import FileCache from './local_file_cache'
import MemoryCache from './memory_cache'
import RedisCache from './redis_cache'

// Zeabur runs a persistent Node process, so its in-memory cache remains useful.
// Keep writes disabled only for Vercel's short-lived production functions.
const enableCacheWrites =
  process.env.npm_lifecycle_event === 'build' ||
  process.env.npm_lifecycle_event === 'export' ||
  !BLOG['isProd'] ||
  !process.env.VERCEL

// Deduplicate concurrent misses. Next.js link prefetch can otherwise trigger the
// same expensive Notion conversion several times before the first one finishes.
const pendingRequests = new Map()

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并写入缓存，最终返回所需数据
 * @param key
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCache(
  key,
  getDataFunction,
  ...getDataArgs
) {
  return getOrSetDataWithCustomCache(key, null, getDataFunction, ...getDataArgs)
}

/**
 * 尝试从缓存中获取数据，如果没有则尝试获取数据并自定义写入缓存，最终返回所需数据
 * @param key
 * @param customCacheTime
 * @param getDataFunction
 * @param getDataArgs
 * @returns {Promise<*|null>}
 */
export async function getOrSetDataWithCustomCache(
  key,
  customCacheTime,
  getDataFunction,
  ...getDataArgs
) {
  const dataFromCache = await getDataFromCache(key)
  if (dataFromCache) {
    // console.log('[缓存-->>API]:', key) // 避免过多的缓存日志输出
    return dataFromCache
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)
  }

  const request = (async () => {
    const data = await getDataFunction(...getDataArgs)
    if (data) {
      // console.log('[API-->>缓存]:', key)
      await setDataToCache(key, data, customCacheTime)
    }
    return data || null
  })()

  pendingRequests.set(key, request)
  try {
    return await request
  } finally {
    if (pendingRequests.get(key) === request) {
      pendingRequests.delete(key)
    }
  }
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache(key, force) {
  if (JSON.parse(BLOG.ENABLE_CACHE) || force) {
    const dataFromCache = await getApi().getCache(key)
    if (!dataFromCache || JSON.stringify(dataFromCache) === '[]') {
      return null
    }
    // console.trace('[API-->>缓存]:', key, dataFromCache)
    return dataFromCache
  } else {
    return null
  }
}

/**
 * 写入缓存
 * @param {*} key
 * @param {*} data
 * @param {*} customCacheTime
 * @returns
 */
export async function setDataToCache(key, data, customCacheTime) {
  if (!enableCacheWrites || !data) {
    return
  }
  //   console.trace('[API-->>缓存写入]:', key)
  await getApi().setCache(key, data, customCacheTime)
}

export async function delCacheData(key) {
  if (!JSON.parse(BLOG.ENABLE_CACHE)) {
    return
  }
  await getApi().delCache(key)
}

/**
 * 缓存实现类
 * @returns
 */
export function getApi() {
  if (BLOG.REDIS_URL) {
    return RedisCache
  } else if (process.env.ENABLE_FILE_CACHE) {
    return FileCache
  } else {
    return MemoryCache
  }
}
