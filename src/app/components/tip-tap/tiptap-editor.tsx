'use client'

import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu } from '@tiptap/react/menus'
import GlobalDragHandle from './extentions/global-drag-handle'
import { LinkPopover, useLinkPopover } from '@/components/tiptap-ui/link-popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/tiptap-ui-primitive/tooltip'
import { ReactNode } from 'react'
import { TextStyleKit } from '@tiptap/extension-text-style'
import './tiptap-editor.scss'

interface TiptapProps {
  content: string,
  onUpdate?: (content: string) => void,
}

const Tiptap = (props: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
        }
      }),
      TextStyleKit,
      GlobalDragHandle.configure({
        dragHandleWidth: 25, // default

        // The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic 
        // scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an 
        // element to a position that is max. 99px away from the edge of the screen
        // You can set this to 0 to prevent auto scrolling caused by this extension
        scrollTreshold: 100, // default

        // The css selector to query for the drag handle. (eg: '.custom-handle').
        // If handle element is found, that element will be used as drag handle. 
        // If not, a default handle will be created
        dragHandleSelector: ".custom-handle", // default is undefined


        // Tags to be excluded for drag handle
        // If you want to hide the global drag handle for specific HTML tags, you can use this option.
        // For example, setting this option to ['p', 'hr'] will hide the global drag handle for <p> and <hr> tags.
        excludedTags: [], // default

        // Custom nodes to be included for drag handle
        // For example having a custom Alert component. Add data-type="alert" to the node component wrapper.
        // Then add it to this list as ['alert']
        //
        customNodes: [],
      }),
    ],
    onUpdate: ({ editor }) => {
      if (props.onUpdate) {
        props.onUpdate(editor.getHTML())
      }
    },
    content: props.content,
    immediatelyRender: false,
  })

  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx?.editor ? ctx.editor.isActive('bold') : false,
      isItalic: ctx?.editor ? ctx.editor.isActive('italic') : false,
      isStrike: ctx?.editor ? ctx.editor.isActive('strike') : false,
      isCode: ctx?.editor ? ctx.editor.isActive('code') : false,
      isLink: ctx?.editor ? ctx.editor.isActive('link') : false,
    })
  })
  const isBold = editorState ? editorState.isBold : false;
  const isItalic = editorState ? editorState.isItalic : false;
  const isStrike = editorState ? editorState.isStrike : false;
  const isCode = editorState ? editorState.isCode : false;

  return (
    <>
      {editor && (
        <>
          <BubbleMenu
            editor={editor}
            {...({
              tippyOptions: {
                placement: 'bottom',
                offset: [0, 8],
                flip: true,
              }
            } as any)}
          >
            <div className={'bubble-menu'}>
              <CustomTooltip content={'Bold'}>
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={isBold ? 'button-marks is-active font-bold' : 'button-marks font-bold'}
                >
                  B
                </button>
              </CustomTooltip>

              <CustomTooltip content={'Italic'}>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={isItalic ? 'button-marks is-active italic' : 'button-marks italic'}
                >
                  I
                </button>
              </CustomTooltip>

              <CustomTooltip content={'Strikethrough'}>
                <button
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={isStrike ? 'button-marks is-active ' : 'button-marks'}
                >
                  <s>S</s>
                </button>
              </CustomTooltip>

              <CustomTooltip content={'Inline Code'}>
                <button
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  className={isCode ? 'button-marks is-active' : 'button-marks'}
                >
                  {'</>'}
                </button>
              </CustomTooltip>
              <LinkPopover
                editor={editor}
                hideWhenUnavailable={true}
                autoOpenOnLinkActive={true}
                onSetLink={() => console.log('Link set!')}
                onOpenChange={(isOpen) => console.log('Popover opened:', isOpen)}
                className={'button-marks'}
              />
              <CustomTooltip content={'Text Color'}>
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  value={editor?.getAttributes('textStyle').color || '#000000'}
                  className="button-marks color-picker"
                  title="Choose text color"
                />
              </CustomTooltip>
            </div>
          </BubbleMenu>
        </>
      )}
      <EditorContent
        editor={editor}
        className="tiptap-content"
      />
    </>
  )
}

interface CustomTooltipProps {
  children: ReactNode
  content?: ReactNode | string
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ children, content }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export default Tiptap