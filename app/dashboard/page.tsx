import { Chat } from './chat'
import { FileExplorer } from './file-explorer'
import { Header } from './header'
import { Horizontal, Vertical } from '@/components/layout/panels'
import { Logs } from './logs'
import { Preview } from './preview'
import { TabContent, TabItem } from '@/components/tabs'
import { Welcome } from '@/components/modals/welcome'
import { cookies } from 'next/headers'
import { getHorizontal, getVertical } from '@/components/layout/sizing'
import { hideBanner } from '@/app/dashboard/actions'

export default async function Page() {
  const store = await cookies()
  const banner = store.get('banner-hidden')?.value !== 'true'
  const horizontalSizes = getHorizontal(store)
  const verticalSizes = getVertical(store)
  return (
    <>
      <Welcome defaultOpen={banner} onDismissAction={hideBanner} />
      <div className="flex flex-col h-screen max-h-screen overflow-hidden p-2.5 gap-2.5 bg-background">
        <Header />

        {/* Mobile tabs */}
        <ul className="flex gap-1 font-mono text-[11px] tracking-tight px-0.5 md:hidden">
          <TabItem tabId="chat">Chat</TabItem>
          <TabItem tabId="preview">Preview</TabItem>
          <TabItem tabId="file-explorer">Files</TabItem>
          <TabItem tabId="logs">Logs</TabItem>
        </ul>

        {/* Mobile layout */}
        <div className="flex flex-1 w-full overflow-hidden md:hidden">
          <TabContent tabId="chat" className="flex-1">
            <Chat className="flex-1 overflow-hidden" />
          </TabContent>
          <TabContent tabId="preview" className="flex-1">
            <Preview className="flex-1 overflow-hidden" />
          </TabContent>
          <TabContent tabId="file-explorer" className="flex-1">
            <FileExplorer className="flex-1 overflow-hidden" />
          </TabContent>
          <TabContent tabId="logs" className="flex-1">
            <Logs className="flex-1 overflow-hidden" />
          </TabContent>
        </div>

        {/* Desktop layout */}
        <div className="hidden flex-1 w-full min-h-0 overflow-hidden md:flex">
          <Horizontal
            defaultLayout={horizontalSizes ?? [45, 55]}
            left={<Chat className="flex-1 overflow-hidden" />}
            right={
              <Vertical
                defaultLayout={verticalSizes ?? [50, 25, 25]}
                top={<Preview className="flex-1 overflow-hidden" />}
                middle={<FileExplorer className="flex-1 overflow-hidden" />}
                bottom={<Logs className="flex-1 overflow-hidden" />}
              />
            }
          />
        </div>
      </div>
    </>
  )
}
