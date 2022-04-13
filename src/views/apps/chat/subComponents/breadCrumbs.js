import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import {Routes} from "../../../../router/routes"
import {Link} from 'react-router-dom'
import {Breadcrumb, BreadcrumbItem} from 'reactstrap'


// map, render, and wrap your breadcrumb components however you want.
const Breadcrumbs = ({breadcrumbs}) => (

    <Breadcrumb className="ms-1">
        {breadcrumbs.map(({
                              match,
                              breadcrumb
                          }) => (
            <BreadcrumbItem key={match.url}>
                <Link to={match.url}>{breadcrumb}</Link>
            </BreadcrumbItem>
        ))}
    </Breadcrumb>
)

export default withBreadcrumbs(Routes)(Breadcrumbs)