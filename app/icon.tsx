import { ImageResponse } from 'next/og'

// Generates /icon at build time — used by browsers as the favicon.
// Renders the SprintBuild monogram on a dark rounded tile.

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

const PATH =
  'M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1F1F1F 0%, #2563EB 100%)',
          borderRadius: 14,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={PATH} fill="#F7F7F5" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
