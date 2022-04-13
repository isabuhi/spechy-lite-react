// ** React Imports
import {Fragment} from 'react'

// ** Custom Components
// ** Third Party Components
import {Row, Col} from 'reactstrap'

// ** Tables
import TableServerSide from './Table'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
    return (
        <Fragment>
            <Row>
                <Col sm='12'>
                    <TableServerSide/>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Tables
