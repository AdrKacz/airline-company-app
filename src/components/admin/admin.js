import { useState } from 'react';

import { createHash } from 'crypto';

import { apiendpoint } from '../../constants';

import databaseSchema from './database-schema.js';

import Alert from './alert.js';
import AdminCreateForm from './admin-create-form';
import AdminUpdateForm from './admin-update-form';
import AdminDeleteForm from './admin-delete-form';

import useObjects from '../../hooks/useObjects.js';
import useUser from '../../hooks/useUser.js';

function Admin() {
    const [alerts, setAlerts] = useState({});
    const [alertCounter, setAlertCounter] = useState(0);
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

    function resetObject(object) {
        setEditedObject({
            ...editedObject,
            [object]: undefined,
        });
    }

    function addAlert(responseJSON, object) {
        if (responseJSON.err) {
            setAlerts({
                ...alerts,
                [alertCounter]: {
                    id: alertCounter,
                    status: 'fail',
                    message: responseJSON.msg,
                }
            });
        } else {
            setAlerts({
                ...alerts,
                [alertCounter]: {
                    id: alertCounter,
                    status: 'success',
                    message: `[${object}] ${responseJSON.msg}`,
                }
            });
        }
        setAlertCounter(alertCounter + 1);
        console.log(responseJSON);
    }

    function removeAlert(alertId) {
        delete alerts[alertId];
        setAlerts({
            ...alerts,
        });
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
        addAlert(responseJSON, object);
        resetObject(object);
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
        await reload();
        addAlert(responseJSON, object);
        resetObject(object);
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
        addAlert(responseJSON, object);
        resetObject(object);
    }

    let forms;
    if (state === 'create') {
        forms = <AdminCreateForm
            databaseSchema={databaseSchema}
            handleSubmitCreateObject={handleSubmitCreateObject}
            handleChangeObject={handleChangeObject}
            editedObject={editedObject}
            objects={objects}
        />
    } else if (state === 'update') {
        forms = <AdminUpdateForm
            databaseSchema={databaseSchema}
            handleSubmitUpdateObject={handleSubmitUpdateObject}
            handleChangeObject={handleChangeObject}
            editedObject={editedObject}
            objects={objects}
        />
    } else if (state === 'delete') {
        forms = <AdminDeleteForm
            databaseSchema={databaseSchema}
            handleSubmitDeleteObject={handleSubmitDeleteObject}
            handleChangeObject={handleChangeObject}
            editedObject={editedObject}
            objects={objects}
        />
    }


    const tabClassName = (name) => (`${(name === state) ? 'active ' : ''}nav-link btn btn-link`)

    return (
    <div className='container pb-5'>
        <main>
        <div className='fixed-top m-3'>
            {Object.values(alerts).map((alert) => (
                <Alert key={alert.id} status={alert.status} message={alert.message} handleClick={() => removeAlert(alert.id)}/>
            ))}
        </div>
        <div className='py-5 text-center'>
            <h2>You're the boss here!</h2>
            <p className='lead'>Just do anything you want, fire is in your hand.</p>
        </div>
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
                    <h6 className="card-subtitle mb-2 text-muted">Raw input hashed</h6>
                    <p className='card-text'>{createHash('sha256').update(rawHash).digest('hex')}</p>  
                </div>
            </div>
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
