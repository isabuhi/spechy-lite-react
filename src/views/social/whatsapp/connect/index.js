import { Fragment } from 'react'
import { useState, useEffect } from "react";
import { Row, Col } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import themeConfig from '@configs/themeConfig'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../../../../@core/auth/jwt/jwtService"
import { useHistory, useParams , useLocation } from "react-router-dom";

const image6 = require('@src/assets/images/ico/spechy-chat-widget6.png').default;
const image5 = require('@src/assets/images/ico/spechy-chat-widget5.png').default;
const image4 = require('@src/assets/images/ico/spechy-chat-widget4.png').default;
const image3 = require('@src/assets/images/ico/spechy-chat-widget3.png').default;
const image2 = require('@src/assets/images/ico/spechy-chat-widget2.png').default;
const image1 = require('@src/assets/images/ico/spechy-chat-widget1.png').default;



const createChatWidget = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const [formState, setFormState] = useState({
        show_data : "",
        status : "",
        change : 1
      });
    useEffect(async () => {
        //dispatch(getFilterItems());
        await axios
          .get(`${BASE_URL}/api/conversation-management/social-media/whatsapp/connect/${id}`)
          .then((response) => {
            //console.log("selectamarin", response.data.data.message.data);
            if (response.status === 200) {
                if(response.data.data.code == 201)
                {
                    setFormState({
                        ...formState,
                        show_data: response.data.data.result.data.code,
                        status : 1
                    })
                } else if(response.data.data.code == 200)
                {
                    setFormState({
                        ...formState,
                        show_data: '<p>logined</p>',
                        status : 2
                    })
                } else if(response.data.data.code == 203){
                    setFormState({
                        ...formState,
                        show_data: 'Please Request Again to Load Qr Image !',
                        status : 3
                    })
                }
              //setFormState(response.data.data);
              //setProjectName(response.data.data.source_name);
            }
            else if(response.status === 203) {
                setFormState({
                    ...formState,
                    show_data: '<p>Please Request Again to Load Qr Image !</p>',
                    status : 3
                })
            }
        });
      }, [formState.change]);
    
    const refreshPage  = () => {
        console.log('adad')
        history.go(0)
    } 
    return (
        <Fragment>
        <Breadcrumbs
            breadCrumbTitle=""
            breadCrumbParent='Chat Widget'
            breadCrumbActive='Create'
        />
        <div className='content-body'>
            <section className='invoice-add-wrapper'>
            <div className='row invoice-add'>
                <div className='col-xl-8 col-md-8 col-8'>
                <div className='card invoice-preview-card'>
                    <div className='card-body invoice-padding pb-0'>
                        <ul>
                            <li>Open the WhatsApp app in your phone</li>
                            <li>Press Setting - WhatsApp Web and then plus </li>
                            <li>Scan the code and wait a minute</li>
                            <li>Keep your phone turned on and connected to the internet</li>
                            <li>Qr code is valid only for 45 seconds. Message sending will be available right after authorzation</li>
                        </ul>
                    <div className='widget-submit-right'>
                        <button className="btn btn-primary btn-block mb-75 waves-effect waves-float waves-light" onClick={refreshPage}>Request New QR Image</button>
                    </div>
                    </div>
                </div>
                </div>
                <div className='col-xl-4 col-md-4 col-4'>
                    <div className='card invoice-preview-card'>
                        <div className='card-body invoice-padding pb-0 qrwhatsapp'>
                                {formState.status === 1 &&
                                    <img src={formState.show_data} height="200"/>
                                }

                                {formState.status === 3 &&
                                    <p>{formState.show_data}</p>
                                }
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </div>
        </Fragment>
    )
}
export default createChatWidget
