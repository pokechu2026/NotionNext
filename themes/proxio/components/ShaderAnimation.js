/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'

/**
 * Shader Lines 動畫背景
 * 使用 Three.js WebGL 渲染流光效果
 * 行動裝置降低 pixelRatio 與動畫速度以節省 GPU 資源
 */
export function ShaderAnimation({ fallbackImage }) {
  const containerRef = useRef(null)
  const sceneRef = useRef({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
    resizeHandler: null
  })
  const [shaderReady, setShaderReady] = useState(false)

  useEffect(() => {
    let scriptEl = null
    let loadTimeout = null
    let cancelled = false

    const isMobile =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    const canvas = document.createElement('canvas')
    const supportsWebGL = Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )

    // 手機與不支援 WebGL 的裝置直接顯示備援圖，避免黑畫面與額外下載。
    if (isMobile || !supportsWebGL) {
      return undefined
    }

    const startShader = () => {
      if (cancelled || !containerRef.current || !window.THREE) return
      try {
        initThreeJS()
      } catch (error) {
        console.warn('[Hero] Shader initialization failed, using fallback', error)
      }
    }

    // 檢查 Three.js 是否已載入
    if (window.THREE) {
      startShader()
    } else {
      scriptEl = document.createElement('script')
      scriptEl.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js'
      scriptEl.async = true
      scriptEl.crossOrigin = 'anonymous'
      scriptEl.onload = () => {
        clearTimeout(loadTimeout)
        startShader()
      }
      scriptEl.onerror = () => {
        clearTimeout(loadTimeout)
        console.warn('[Hero] Three.js failed to load, using fallback')
      }
      document.head.appendChild(scriptEl)

      loadTimeout = setTimeout(() => {
        console.warn('[Hero] Three.js load timed out, using fallback')
        scriptEl?.remove()
        scriptEl = null
      }, 8000)
    }

    return () => {
      cancelled = true
      clearTimeout(loadTimeout)
      // Cleanup
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      if (sceneRef.current.resizeHandler) {
        window.removeEventListener('resize', sceneRef.current.resizeHandler)
      }
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose()
      }
      if (scriptEl && scriptEl.parentNode) {
        document.head.removeChild(scriptEl)
      }
    }
  }, [])

  const initThreeJS = () => {
    if (!containerRef.current || !window.THREE) return
    const THREE = window.THREE
    const container = containerRef.current

    // 清除既有內容
    container.innerHTML = ''

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneBufferGeometry(2, 2)

    const uniforms = {
      time: { type: 'f', value: 1.0 },
      resolution: { type: 'v2', value: new THREE.Vector2() }
    }

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }

      varying vec2 vUv;
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256,256);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;
        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
          }
        }
        gl_FragColor = vec4(color[2],color[1],color[0],1.0);
      }
    `

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'low-power'
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 設定 canvas 樣式
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    const onWindowResize = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: null,
      resizeHandler: onWindowResize
    }

    onWindowResize()
    window.addEventListener('resize', onWindowResize, false)

    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
    }

    animate()
    setShaderReady(true)
  }

  return (
    <>
      <div
        className='w-full absolute h-screen left-0 top-0 pointer-events-none overflow-hidden'
        style={{
          background: 'radial-gradient(circle at 30% 20%, #23304a 0%, #0a0a0a 58%, #020202 100%)'
        }}>
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt=''
            className='h-full w-full object-cover opacity-60'
            onError={event => {
              event.currentTarget.style.display = 'none'
            }}
          />
        )}
      </div>
      <div
        ref={containerRef}
        className='w-full absolute h-screen left-0 top-0 pointer-events-none'
        style={{
          opacity: shaderReady ? 1 : 0,
          transition: 'opacity 500ms ease'
        }}
      />
    </>
  )
}
