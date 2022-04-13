// ** React Imports
import {Fragment} from 'react'

// ** Custom Components
// ** Third Party Components
import {Row, Col} from 'reactstrap'

// ** Tables
import TableServerSide from './Table'
import Breadcrumbs from "../subComponents/breadCrumbs"
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
    return (
        <Fragment>
            <div className="d-flex justify-content-start breadcrumb-wrapper">
                <Breadcrumbs/>
            </div>
            <Row>
                <Col sm='12'>
                    <TableServerSide/>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Tables
