"use client";
import { ResizablePanel } from "@/components/ui/resizable";
import { ChevronsLeft } from "lucide-react";
import React from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import UserItem from "./userItem";

const Sidebar = () => {
  const panelRef = React.useRef<ImperativePanelHandle>(null);

  const collapseSidebar = () => {
    const panel = panelRef.current;
    if (panel) {
      panel.collapse();
    }
  };

  return (
    <ResizablePanel
      defaultSize={15}
      minSize={15}
      maxSize={25}
      collapsible
      collapsedSize={0}
      ref={panelRef}
      className='mt-[4.5rem] h-[calc(100vdh-4.5rem)]'
    >
      <aside className='background-light900_dark200 group/sidebar relative h-[calc(100dvh-4.5rem)] w-full p-6 shadow-light-300'>
        <div>
          <div
            role='button'
            className='text-light400_light500 absolute right-2 top-3 size-6 rounded-sm opacity-0 transition-all duration-300 hover:bg-light-700 group-hover/sidebar:opacity-100 dark:hover:bg-dark-400'
            onClick={collapseSidebar}
          >
            <ChevronsLeft className='size-6 ' />
          </div>
        </div>
        <div>
          <UserItem />
        </div>
      </aside>
    </ResizablePanel>
  );
};

export default Sidebar;
