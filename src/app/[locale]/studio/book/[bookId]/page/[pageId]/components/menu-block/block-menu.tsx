import BlockDeleteButton from './block-delete-button'
import BlockCreateButton from './block-create-menu-button'

interface BlockMenuProps {
    onDelete: () => void
    onCreate: () => void
    classCSS?: string
    iconStyle?: string
    style?: React.CSSProperties
}

export default function BlockMenu({ onDelete, onCreate, classCSS, iconStyle, style }: BlockMenuProps) {
    return (
        <div className={ classCSS ?? ''} style={style}>
            <BlockCreateButton
                iconStyle={iconStyle}
                onCreate={onCreate}
            />
            <BlockDeleteButton
                iconStyle={iconStyle}
                onDelete={onDelete}
            />
        </div >
    )
}