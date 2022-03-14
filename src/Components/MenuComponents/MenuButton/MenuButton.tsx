import { Box, Button } from "@mui/material"


type MenuButtonProps = {
    onClick: () => void,
    text: string
}

function MenuButton(props: MenuButtonProps) {
    return <Box sx={{ pl: "10px", pr: "10px" }}>
        <Button variant="outlined" disableElevation onClick={props.onClick}>{props.text}</Button>
    </Box>
}

export default MenuButton