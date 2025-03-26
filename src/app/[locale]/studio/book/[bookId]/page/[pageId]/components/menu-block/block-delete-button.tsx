import DeleteIcon from '@mui/icons-material/Delete';

interface BlockDeleteButtonProps {
    onDelete: () => void,
    iconStyle?: string
}

export default function BlockDeleteButton({ onDelete, iconStyle }: BlockDeleteButtonProps) {
    return (
        <div>
            <div className={iconStyle || ''}>
                <button onClick={onDelete}><DeleteIcon fontSize="small" /></button>
            </div>
        </div>
    )
}