import React, { useState } from 'react';
import {AsyncPaginate} from 'react-select-async-paginate';
import { geoApiOptions, GEO_API_URL } from "../api";
import axios from 'axios';

function Search({searchLocation}) {
    const [search, setSearch] = useState();

    const handleOnChange = (searchData) => {
        setSearch(searchData)
        searchLocation(searchData)
    }

    const loadOptions = (inputValue) => {
        return axios.request(
            `${GEO_API_URL}?namePrefix=${inputValue}`,
            geoApiOptions
        ).then(function (response) {
            return {
                options: response.data.data.map((city) => {
                  return {
                    value: `${city.latitude} ${city.longitude}`,
                    label: `${city.name}, ${city.countryCode}`,
                  };
                }),
            };
        }).catch(function (error) {
            
        });
    }

    return (
        <div className='w-50' style={{zIndex: '20'}}>
            <AsyncPaginate
                className='w-auto'
                value={search}
                debounceTimeout={600}
                onChange={handleOnChange}
                placeholder="Enter City Name"
                loadOptions={loadOptions}
            />
        </div>
    )
}

export default Search