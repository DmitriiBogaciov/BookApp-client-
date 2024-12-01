import React from "react";
import { Page } from "@/app/utils/interfaces";
import { Link } from "@/navigation";
import { SlOptions } from "react-icons/sl";
import AddIcon from "@mui/icons-material/Add";
import CreatePageButton from "./create-page-button";
import IconMenu from "./book-icon-menu";

interface PageLiProps {
  page: Page;
  bookId: string;
  activeMenu: { pageId: string; x: number; y: number } | null;
  handleMenuClick: (e: React.MouseEvent, pageId: string) => void;
  handleRemovePage: (pageId: string) => void;
  menuRef: React.RefObject<HTMLDivElement>;
  activeMenuPosition: { x: number; y: number };
}

const PageLI: React.FC<PageLiProps> = ({
  page,
  bookId,
  activeMenu,
  handleMenuClick,
  handleRemovePage,
  menuRef,
}) => {
  return (
    <li className="pl-2 pt-1 pb-1 pr-2 hover:bg-gray-200 cursor-pointer">
      <div className="flex justify-between">
        <Link
          href={`/studio/book/${bookId}/page/${page._id}`}
          className="flex-1 no-underline"
        >
          {page.title}
        </Link>
        <button onClick={(e) => handleMenuClick(e, page._id)} className="content-center">
          <SlOptions className="mr-1" />
        </button>
        <CreatePageButton bookId={bookId} parentId={page._id}>
          <AddIcon />
        </CreatePageButton>
        {activeMenu && activeMenu.pageId === page._id && (
          <div
            ref={menuRef}
            className="absolute bg-white border shadow-md rounded"
            style={{ top: `${activeMenu.y}px`, left: `${activeMenu.x}px` }}
          >
            <IconMenu onDelete={() => handleRemovePage(page._id)} />
          </div>
        )}
      </div>
    </li>
  );
};

export default PageLI;
