import React from 'react';
import {Container, Image} from 'react-bootstrap';
import Logo from '../assets/Logo.png';
import Search from './Search';

function Header({searchLocation}) {
    
    return (
        <Container className='d-flex justify-content-between align-items-center shadow rounded py-2 py-md-0' fluid>
            <Image src={Logo} className='w-25'/>
            <Search searchLocation={searchLocation}/>
        </Container>
    )
}

export default Header