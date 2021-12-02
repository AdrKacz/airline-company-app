import { useState } from 'react';

import { createHash } from 'crypto';

import { apiendpoint } from '../../constants';

import useObjects from '../../hooks/useObjects.js';
import useUser from '../../hooks/useUser.js';

const capitalize = (string) => (
    string.split('-').map((word, i) => (word[0].toUpperCase() + word.slice(1))).join(' ')
);

const databaseSchema = {
    'user': {
        'fields': [
            ['email', 'text'],
            ['password-hash', 'text']
        ]
    },
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
            ['user-id', '$user$email'],
        ]
    },
    'consumer': {
        'fields': [
            ['number', 'number'],
            ['surname', 'text'],
            ['name', 'text'],
            ['user-id', '$user$email'],
        ]
    },

    'connection': {
        'fields': [
            ['departure-airport-id', '$airport$name'],
            ['arrival-airport-id', '$airport$name'],
        ]
    },
    'pilot': {
        'fields': [
            ['employee-id', '$employee$name.surname'],
            ['license-number', 'text'],
        ]
    },
    'crew-member': {
        'fields': [
            ['employee-id', '$employee$name.surname'],
            ['role', 'text'],
        ]
    },

    'flight': {
        'fields': [
            ['from', 'date'],
            ['to', 'date'],
            ['number', 'number'],
            ['connection-id', '$connection$id'],
            ['airplane-id', '$airplane$number'],
            ['departure-day', 'text'],
            ['arrival-day', 'text'],
            ['departure-time', 'time'],
            ['arrival-time', 'time'],
        ]
    },
    
    'departure': {
        'fields': [
            ['flight-id', '$flight$from.to'],
            ['date', 'date'],
            ['pilot-id', '$pilot$name.surname'],
            ['optional-pilot-id', '$pilot$name.surname'],
            ['first-crew-member-id', '$crew-member$name.surname'],
            ['second-crew-member-id', '$crew-member$name.surname'],
            ['number-of-empty-seat', 'number'],
            ['number-of-reserved-seat', 'number'],
        ]
    },

    'ticket': {
        'fields': [
            ['number', 'number'],
            ['date-time-of-issue', 'datetime-local'],
            ['price', 'number'],
            ['departure-id', '$departure$date'],
            ['consumer-id', '$consumer$date'],
        ]
    },
}

function Admin() {
    const [state, setState] = useState('create');
    const [showCollapse, setShowCollapse] = useState(false);
    const [rawHash, setRawHash] = useState('');
    const [user, , ] = useUser();

    const [editedObject, setEditedObject] = useState({});
    const [objects, reload] = useObjects([
        'users',
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

    function handleCollapseClick() {
        setShowCollapse(!showCollapse);
    }

    function handleTabClick(name) {
        setEditedObject({}); // remove if you want edit to be persitent across tabs
        setState(name);
    }

    function handleChangeObject(object, field, value) {
        if (field === 'id') {
            setEditedObject({
                ...editedObject,
                [object]: {
                    [field]: parseInt(value),
                },
            });
            return;
        }

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
        // TODO: Display message when create did not succeed (never)
        // TODO: Do not submit if one field is undefined 
        const responseJSON = await fetch(apiendpoint + '/admin/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: user.token,
                object: object,
                data: editedObject[object]
            }),
        }).then(response => response.json());
        await reload();
        console.log(responseJSON);
    }

    async function handleSubmitUpdateObject(object) {
        // TODO: Display message when update did not succeed (never)
        // TODO: Do not submit if one field is undefined 
        const responseJSON = await fetch(apiendpoint + '/admin/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: user.token,
                object: object,
                objectId: editedObject[object] && editedObject[object].id,
                data: editedObject[object],
            }),
        }).then(response => response.json());
        await reload()
        console.log(responseJSON);
    }

    async function handleSubmitDeleteObject(object) {
        // TODO: Display message when delete did not succeed
        const responseJSON = await fetch(apiendpoint + '/admin/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: user.token,
                object: object,
                objectId: editedObject[object].id
            }),
        }).then(response => response.json());
        await reload();
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
                                        <option>...</option>
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
                                        value={editedObject[key] && editedObject[key][field] ? editedObject[key][field] : ''}
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
            <form key={i} className='mb-5' onSubmit={(e) => {e.preventDefault(); handleSubmitUpdateObject(key)}}>
                <h4 className='mb-3'>{capitalize(key)}</h4>
                <div key={`selectmainupdate$${i}`} className='form-floating mb-3'>
                    <select
                            value={editedObject[key] ? editedObject[key].id : undefined}
                            onChange={({target}) => (handleChangeObject(key, 'id', target.value))}
                            className='form-select'
                            id={`floatingselectmainupdate${key}`}
                        >
                            <option>...</option>
                            {(objects[key + 's'] || []).map((o, k) => (
                                <option key={`floatingselectmainupdate$${key}$${k}`} value={o.id}>{o.id}</option>
                            ))}
                    </select>
                    <label htmlFor={`floatingselectmainupdate$${key}`}>{capitalize(key)}</label>
                </div>
                {editedObject[key] && editedObject[key].id &&
                    value.fields.map(([field, type], j) => {
                        if (type[0] === '$') {
                            const [localObject, localFieldsString] = type.slice(1).split('$');
                            const localFields = localFieldsString.split('.')

                            let value;
                            if (editedObject[key]) {
                                if (editedObject[key][field]) {
                                    value = editedObject[key][field]
                                } else {
                                    const item = (objects[key + 's'] || []).find(el => el.id === editedObject[key].id);
                                    console.log('Update item', item);
                                    if (item) {
                                        value = item[field];
                                    }
                                }
                            }
                            console.log('Update', value);
                            
                            return (
                                <div key={`${i}$${j}`} className='form-floating mb-3'>
                                    <select
                                        value={value}
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
                <div key={`selectmaindelete$${i}`} className='form-floating mb-3'>
                    <select
                        value={editedObject[key] ? editedObject[key].id : undefined}
                        onChange={({target}) => (handleChangeObject(key, 'id', target.value))}
                        className='form-select'
                        id={`floatingselectmaindelete$${key}`}
                    >
                        <option>...</option>
                        {(objects[key + 's'] || []).map((o, k) => (
                            <option key={`floatingselectmaindelete$${key}$${k}`} value={o.id}>{o.id}</option>
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
        <div className='mb-3'>
            <button
                className="btn btn-outline-primary mb-3"
                onClick={handleCollapseClick}
            >
                {showCollapse? 'Hide' : 'Show'} help to hash input
            </button>
            <div className={`collapse${showCollapse ? '.show' : ''}`}>
                <div className="card card-body">
                    <div className='form-floating mb-3'>
                        <input
                            onChange={({target}) => (setRawHash(target.value))}
                            type='text'
                            className='form-control'
                            value={rawHash}
                            placeholder='Raw Hash'
                            id='hashhelper'
                        />
                        <label htmlFor='hashhelper'>Raw input</label>
                    </div>
                    <h6 class="card-subtitle mb-2 text-muted">Raw input hashed</h6>
                    <p className='card-text'>{createHash('sha256').update(rawHash).digest('hex')}</p>  
                </div>
            </div>
        </div>
        {forms}
        </main>
    </div>
    );
}

export default Admin;
