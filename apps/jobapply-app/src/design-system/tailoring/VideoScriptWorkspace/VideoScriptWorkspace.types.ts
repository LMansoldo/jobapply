export interface VideoScriptWorkspaceProps {
  /** Current video script content */
  videoContent: string
  /** Whether video script generation is loading */
  videoLoading: boolean
  /** Callback when video content changes */
  onVideoContentChange: (content: string) => void
  /** Callback to generate video script */
  onGenerateVideoScript: () => void
}