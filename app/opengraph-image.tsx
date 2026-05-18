import { ImageResponse } from 'next/og'
import { BRAND_NAME, siteHost } from '@/lib/site'

// Generates /opengraph-image (1200x630) used in Twitter / OG previews.

export const alt = `${BRAND_NAME} — AI coding platform`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PATH =
  'M 160 88 L 194 34 L 216 0 L 256 0 L 256 40 L 221.5 93.5 L 200 128 L 256 128 L 256 256 L 96 256 L 96 168 L 64.246 220 L 40 256 L 0 256 L 0 216 L 34 162 L 56 128 L 0 128 L 0 0 L 160 0 Z'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 96,
          background:
            'radial-gradient(circle at 25% 0%, #2563EB 0%, transparent 55%), linear-gradient(180deg, #F0F0EE 0%, #E5E5E1 100%)',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg, #1F1F1F 0%, #2563EB 100%)',
              borderRadius: 18,
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={PATH} fill="#F7F7F5" />
            </svg>
          </div>
          <div
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 30,
              fontWeight: 600,
              color: '#1F1F1F',
              letterSpacing: '-0.02em',
            }}
          >
            {BRAND_NAME.toLowerCase()}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: '#2563EB',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            AI coding platform
          </div>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 500,
              letterSpacing: '-0.025em',
              color: '#0A0A0A',
            }}
          >
            Sprint from idea to running app, in a real sandbox.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#5A5A5A',
            fontSize: 22,
          }}
        >
          <span>Claude · GPT · Grok via Vercel AI Gateway</span>
          <span style={{ color: '#1F1F1F', fontWeight: 500 }}>
            {siteHost()}
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
