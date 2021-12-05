import { capitalize } from './capitalize';

function AdminUpdateForm({databaseSchema, handleSubmitUpdateObject, handleChangeObject, editedObject, objects}) {
    return (
        <>
        {Object.entries(databaseSchema).map(([key, value], i) => (
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

                            // Retrieve value from API or from local (priority to local)
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
                            
                        } else if (type === 'bool') {
                            // Retrieve value from API or from local (priority to local)
                            let value = false;
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
                            return (
                                <div key={`${i}$${j}`} className="form-check form-switch mb-3">
                                    <input
                                        onChange={({target}) => handleChangeObject(key, field, target.checked)}
                                        checked={value}
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="flexSwitchCheckDefault"/>
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{capitalize(field)}</label>
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
            ))}
        </>
    );
}

export default AdminUpdateForm;