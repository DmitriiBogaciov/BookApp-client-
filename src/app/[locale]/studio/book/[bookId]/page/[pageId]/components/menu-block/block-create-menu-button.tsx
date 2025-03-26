import AddIcon from '@mui/icons-material/Add';

interface BlockCreateButtonMenuProps {
    onCreate: () => void
    iconStyle?: string
}

export default function BlockCreateButtonMenu({ onCreate, iconStyle }: BlockCreateButtonMenuProps) {
    return (
        <div>
            <button
                className={iconStyle || ''}
                onClick={onCreate}><AddIcon fontSize='small' />
            </button>
        </div>
    )
}