'use client'

import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
// import { BubbleMenu } from '@tiptap/react/menus'
import { LinkPopover, useLinkPopover } from '@/components/tiptap-ui/link-popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/tiptap-ui-primitive/tooltip'
import { ReactNode } from 'react'
import { TextStyleKit } from '@tiptap/extension-text-style'
import DragHandle from '@tiptap/extension-drag-handle-react'
import { RiDraggable } from "react-icons/ri";
import './tiptap-editor.scss'
import { flip, offset, shift } from '@floating-ui/react'

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
          {/* <BubbleMenu
            editor={editor}
            {...({
              tippyOptions: {
                placement: 'bottom',
                offset: [0, 8],
                flip: true,
              }
            } as any)}
          > */}
          <div className={'bubble-menu'}
          >
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
                onChange={(e) => {
                  const color = e.target.value
                  if (!editor) return
                  const { empty } = editor.state.selection
                  if (empty) {
                    // нет выделения — выходим, чтобы не ловить ошибку
                    return
                  }
                  editor.chain().focus().setColor(color).run()
                }}
                value={editor?.getAttributes('textStyle').color || '#000000'}
                className="button-marks color-picker"
              />
            </CustomTooltip>
          </div>
          {/* </BubbleMenu> */}
        </>
      )}
      <div className='tiptap-shell'>
        {editor && (
          <DragHandle
            editor={editor}
            className="drag-handle"
            computePositionConfig={{
              placement: 'left-start',
              middleware: [
                offset(6),
                flip(),
                shift({ padding: 8 }),
              ],
            }}
          >
            <RiDraggable
              className='drag-icon'
            />
          </DragHandle>
        )}
        <EditorContent
          editor={editor}
          className="tiptap-content"
        />
      </div>
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