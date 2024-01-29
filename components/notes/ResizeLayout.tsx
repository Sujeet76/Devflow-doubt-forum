import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ReactNode } from "react";

interface Props {
  sidePanel: ReactNode;
  children: ReactNode;
}

export function ResizeLayout({ sidePanel, children }: Props) {
  return (
    <ResizablePanelGroup direction='horizontal'>
      {sidePanel}
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={75}
        className='mt-[4.5rem] h-[calc(100vdh-4.5rem)]'
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
