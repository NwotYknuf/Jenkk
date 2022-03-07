import './Menu.css'

type MenuProps = {
    children: React.ReactNode[];
}

function Menu(props: MenuProps) {
    return <div className='menu'>
        {props.children.map(component => {
            return component;
        })}
    </div>
}

export default Menu;