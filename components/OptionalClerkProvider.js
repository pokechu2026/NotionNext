import { zhCN } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'

export default function OptionalClerkProvider({ children }) {
  return <ClerkProvider localization={zhCN}>{children}</ClerkProvider>
}
