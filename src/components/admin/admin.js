import { useState } from 'react';

import useObjects from '../../hooks/useObjects.js';

const capitalize = (string) => (
    string.split('-').map((word, i) => (word[0].toUpperCase() + word.slice(1))).join(' ')
);

const databaseSchema = {
    'airport': {
        'fields': [
            ['name', 'text'],
            ['code', 'text'],
        ]
    },
    'airplane': {
        'fields': [
            ['number', 'number'],
            ['type', 'text'],
        ]
    },
    'employee': {
        'fields': [
            ['security-number', 'number'],
            ['surname', 'text'],
            ['name', 'text'],
            ['address', 'text'],
            ['salary', 'number'],
        ]
    },
    'consumer': {
        'fields': [
            ['number', 'number'],
            ['surname', 'text'],
            ['name', 'text'],
        ]
    },

    'connection': {
        'fields': [
            ['departure-airport', '$airport$name'],
            ['arrival-airport', '$airport$name'],
        ]
    },
    'pilot': {
        'fields': [
            ['employee', '$employee$name.surname'],
            ['license-number', 'text'],
        ]
    },
    'crew-member': {
        'fields': [
            ['employee', '$employee$name.surname'],
            ['role', 'text'],
        ]
    },

    'flight': {
        'fields': [
            ['from', 'date'],
            ['to', 'date'],
            ['number', 'number'],
            ['connection', '$connection$id'],
            ['airplane', '$airplane$number'],
            ['departure-day', 'text'],
            ['arrival-day', 'text'],
            ['departure-time', 'time'],
            ['arrival-time', 'time'],
        ]
    },
    
    'departure': {
        'fields': [
            ['flight', '$flight$from.to'],
            ['date', 'date'],
            ['pilot', '$pilot$name.surname'],
            ['optional-pilot', '$pilot$name.surname'],
            ['first-crew-member', '$crew-member$name.surname'],
            ['second-crew-member', '$crew-member$name.surname'],
            ['number-of-empty-seat', 'number'],
            ['number-of-reserved-seat', 'number'],
        ]
    },

    'ticket': {
        'fields': [
            ['number', 'number'],
            ['date-time-of-issue', 'datetime-local'],
            ['price', 'number'],
            ['departure', '$departure$date'],
            ['consumer', '$consumer$date'],
        ]
    },
}

function Admin() {
    const [create, setCreate] = useState({});
    const objects = useObjects([
        'airports',
        'employees',
        'connections',
        'airplanes',
        'flights',
        'pilots',
        'crew-members',
        'departures',
        'consumers'
    ]);

    function handleChangeObject(object, field, value) {
    if (create[object]) {
        setCreate({
            ...create,
            [object]: {
                ...create[object],
                [field]: value,
            },
        });
    } else {
        setCreate({
            ...create,
            [object]: {
                [field]: value,
            },
        });
    }
    }
    function handleSubmitObject(object) {
    console.log(create[object]);
    }

    const forms = Object.entries(databaseSchema).map(([key, value], i) => (
    <form key={i} className='mb-5' onSubmit={(e) => {e.preventDefault(); handleSubmitObject(key)}}>
        <h4 className='mb-3'>{capitalize(key)}</h4>
        {
            value.fields.map(([field, type], j) => {
                if (type[0] === '$') {
                    const [localObject, localFieldsString] = type.slice(1).split('$');
                    const localFields = localFieldsString.split('.')
                    console.log(objects, localObject, objects[localObject + 's'])
                    return (
                        <div key={`${i}$${j}`} className='form-floating mb-3'>
                            <select
                                value={create[key] ? create[key][field] : undefined}
                                onChange={({target}) => (handleChangeObject(key, field, target.value))}
                                className='form-select'
                                id={`floatingselect$${key}$${field}`}
                            >
                                {(objects[localObject + 's'] || []).map((o, i) => (
                                    <option key={`floatingselect$${key}$${field}$${i}`} value={o.id}>{localFields.map(f => o[f]).join(' ')}</option>
                                ))}
                            </select>
                            <label htmlFor={`floatingselect$${key}$${field}`}>{capitalize(field)}</label>
                        </div>
                    );
                } else {
                    return (
                        <div key={`${i}$${j}`} className='form-floating mb-3'>
                            <input onChange={({target}) => (handleChangeObject(key, field, target.value))} type={type} className='form-control' id={`floating$${key}$${field}`} placeholder={field} required/>
                            <label htmlFor={`floating$${key}$${field}`}>{capitalize(field)}</label>
                        </div>
                    );
                }
            })
        }
        <button className="w-100 btn btn-lg btn-primary" type="submit">Create</button>
    </form>
    ));


    return (
    <div className='container pb-5'>
        <main>
        <div className='py-5 text-center'>
            <h2>You're the boss here!</h2>
            <p className='lead'>Just do anything you want, fire is in your hand.</p>
        </div>
        {forms}
        </main>
    </div>
    );
}

export default Admin;
