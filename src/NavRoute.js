import PrivateRoute from './PrivateRoute'

const NavRoute = ({ exact, path, component: Component }) => (
    <PrivateRoute exact={exact} path={path} render={(props) => (
        <div>
            <div>menu goes here</div>
            <Component {...props} />
        </div>
    )} />
)

export default PrivateRoute