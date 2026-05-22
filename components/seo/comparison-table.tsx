import {
  type Competitor,
  FEATURES,
  SPRINTBUILD_ROW,
  supportBadgeProps,
} from '@/lib/competitors'
import { BRAND_NAME } from '@/lib/site'

interface Props {
  competitor: Competitor
}

/**
 * Side-by-side feature matrix used on /vs/[competitor] pages.
 * Mirrors the rows in `FEATURES` so one table edit propagates to every
 * comparison page. Detail copy is intentionally short — the page body
 * carries the long-form claims.
 */
export function ComparisonTable({ competitor }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white">
      <table className="w-full text-[13px]">
        <thead className="bg-[#f7f7f5] border-b border-black/5">
          <tr>
            <th
              scope="col"
              className="text-left px-5 py-4 font-medium text-gray-700 w-[36%]"
            >
              Feature
            </th>
            <th
              scope="col"
              className="text-left px-5 py-4 font-medium text-blue-600"
            >
              {BRAND_NAME}
            </th>
            <th
              scope="col"
              className="text-left px-5 py-4 font-medium text-gray-700"
            >
              {competitor.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map((feature) => {
            const us = SPRINTBUILD_ROW[feature.id]
            const them = competitor.features[feature.id]
            return (
              <tr
                key={feature.id}
                className="border-b border-black/5 last:border-b-0"
              >
                <th
                  scope="row"
                  className="text-left px-5 py-4 font-medium text-gray-900 align-top"
                >
                  <div>{feature.label}</div>
                  <div className="text-[11.5px] text-gray-500 font-normal mt-1 leading-relaxed">
                    {feature.description}
                  </div>
                </th>
                <Cell cell={us} />
                <Cell cell={them ?? { support: 'unknown' }} />
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Cell({
  cell,
}: {
  cell: { support: 'yes' | 'partial' | 'no' | 'unknown'; detail?: string }
}) {
  const badge = supportBadgeProps(cell.support)
  return (
    <td className="px-5 py-4 align-top">
      <span className={badge.className}>{badge.children}</span>
      {cell.detail ? (
        <div className="text-[11.5px] text-gray-500 mt-1.5 leading-relaxed max-w-[28ch]">
          {cell.detail}
        </div>
      ) : null}
    </td>
  )
}
