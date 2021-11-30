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
    const [state, setState] = useState('create');

    const [editedObject, setEditedObject] = useState({});
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

    function handleTabClick(name) {
        setState(name);
    }

    function handleChangeObject(object, field, value) {
        if (editedObject[object]) {
            setEditedObject({
                ...editedObject,
                [object]: {
                    ...editedObject[object],
                    [field]: value,
                },
            });
        } else {
            setEditedObject({
                ...editedObject,
                [object]: {
                    [field]: value,
                },
            });
        }
    }

    async function handleSubmitCreateObject(object) {
        const responseJSON = await fetch('http://127.0.0.1:8080/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                object: object,
                data: editedObject[object]
            }),
        }).then(response => response.json());

        console.log(responseJSON);
    }

    async function handleSubmitUpdateObject(object) {
        const responseJSON = await fetch('http://127.0.0.1:8080/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                object: object,
                objectId: editedObject[object] && editedObject[object].id,
                data: editedObject[object],
            }),
        }).then(response => response.json());

        console.log(responseJSON);
    }

    async function handleSubmitDeleteObject(object) {
        const responseJSON = await fetch('http://127.0.0.1:8080/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                object: object,
                objectId: editedObject[object].id
            }),
        }).then(response => response.json());

        console.log(responseJSON);
    }

    let forms;
    if (state === 'create') {
        forms = Object.entries(databaseSchema).map(([key, value], i) => (
            <form key={i} className='mb-5' onSubmit={(e) => {e.preventDefault(); handleSubmitCreateObject(key)}}>
                <h4 className='mb-3'>{capitalize(key)}</h4>
                {
                    value.fields.map(([field, type], j) => {
                        if (type[0] === '$') {
                            const [localObject, localFieldsString] = type.slice(1).split('$');
                            const localFields = localFieldsString.split('.')
                            return (
                                <div key={`${i}$${j}`} className='form-floating mb-3'>
                                    <select
                                        value={editedObject[key] ? editedObject[key][field] : undefined}
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
                                    <input
                                        onChange={({target}) => (handleChangeObject(key, field, target.value))}
                                        type={type}
                                        className='form-control'
                                        id={`floating$${key}$${field}`}
                                        placeholder={field}
                                        value={editedObject[key] ? editedObject[key][field] : ''}
                                        required/>
                                    <label htmlFor={`floating$${key}$${field}`}>{capitalize(field)}</label>
                                </div>
                            );
                        }
                    })
                }
                <button className="w-100 btn btn-lg btn-primary" type="submit">Create</button>
            </form>
            ));
    } else if (state === 'update') {
        forms = Object.entries(databaseSchema).map(([key, value], i) => (
            <form key={i} className='mb-5' onSubmit={(e) => {e.preventDefault(); handleSubmitCreateObject(key)}}>
                <h4 className='mb-3'>{capitalize(key)}</h4>
                <div key={`selectmain$${i}`} className='form-floating mb-3'>
                    <select
                            value={editedObject[key] ? editedObject[key].id : undefined}
                            onChange={({target}) => (handleChangeObject(key, 'id', parseInt(target.value)))}
                            className='form-select'
                            id={`floatingselectmain${key}`}
                        >
                            <option>...</option>
                            {(objects[key + 's'] || []).map((o, k) => (
                                <option key={`floatingselectmain$${key}$${k}`} value={o.id}>{o.id}</option>
                            ))}
                    </select>
                    <label htmlFor={`floatingselectmain$${key}`}>{capitalize(key)}</label>
                </div>
                {editedObject[key] && editedObject[key].id &&
                    value.fields.map(([field, type], j) => {
                        if (type[0] === '$') {
                            const [localObject, localFieldsString] = type.slice(1).split('$');
                            const localFields = localFieldsString.split('.')
                            return (
                                <div key={`${i}$${j}`} className='form-floating mb-3'>
                                    <select
                                        value={editedObject[key] ? editedObject[key][field] : undefined}
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
                            let value = '';
                            console.log('---', key)
                            if (editedObject[key]) {
                                if (editedObject[key][field]) {
                                    value = editedObject[key][field]
                                } else {
                                    const item = (objects[key + 's'] || []).find(el => el.id === editedObject[key].id);
                                    if (item) {
                                        value = item[field];
                                    }
                                }
                            }
                            return (
                                <div key={`${i}$${j}`} className='form-floating mb-3'>
                                    <input
                                        onChange={({target}) => (handleChangeObject(key, field, target.value))}
                                        type={type}
                                        className='form-control'
                                        id={`floating$${key}$${field}`}
                                        placeholder={field}
                                        value={value}
                                        required/>
                                    <label htmlFor={`floating$${key}$${field}`}>{capitalize(field)}</label>
                                </div>
                            );
                        }
                    })
                }
                <button className="w-100 btn btn-lg btn-primary" type="submit">Update</button>
            </form>
            ));
    } else if (state === 'delete') {
        forms = Object.entries(databaseSchema).map(([key, value], i) => (
            <form key={i} className='mb-5' onSubmit={(e) => {e.preventDefault(); handleSubmitDeleteObject(key)}}>
                <h4 className='mb-3'>{capitalize(key)}</h4>
                <div key={`selectmain$${i}`} className='form-floating mb-3'>
                    <select
                        value={editedObject[key] ? editedObject[key].id : undefined}
                        onChange={({target}) => (handleChangeObject(key, 'id', parseInt(target.value)))}
                        className='form-select'
                        id={`floatingselectmain$${key}`}
                    >
                        <option>...</option>
                        {(objects[key + 's'] || []).map((o, k) => (
                            <option key={`floatingselectmain$${key}$${k}`} value={o.id}>{o.id}</option>
                        ))}
                    </select>
                    <label htmlFor={`floatingselectmain$${key}`}>{capitalize(key)}</label>
                </div>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Delete</button>
            </form>
            ));
    }


    const tabClassName = (name) => (`${(name === state) ? 'active ' : ''}nav-link btn btn-link`)

    return (
    <div className='container pb-5'>
        <main>
        <div className='py-5 text-center'>
            <h2>You're the boss here!</h2>
            <p className='lead'>Just do anything you want, fire is in your hand.</p>
        </div>
        <ul className='nav nav-tabs mb-3'>
            <li className='nav-item'>
                <button onClick={(e) => (handleTabClick('create'))} type='button' className={tabClassName('create')}>Create</button>
            </li>
            <li className='nav-item'>
                <button onClick={(e) => (handleTabClick('update'))} type='button' className={tabClassName('update')}>Update</button>
            </li>
            <li className='nav-item'>
                <button onClick={(e) => (handleTabClick('delete'))} type='button' className={tabClassName('delete')}>Delete</button>
            </li>
        </ul>
        {forms}
        </main>
    </div>
    );
}

export default Admin;
