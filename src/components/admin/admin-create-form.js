import { capitalize } from './capitalize';

function AdminCreateForm({databaseSchema, handleSubmitCreateObject, handleChangeObject, editedObject, objects}) {
    return (
        <>
        {Object.entries(databaseSchema).map(([key, value], i) => (
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
                        } else if (type === 'bool') {
                            return (
                                <div key={`${i}$${j}`} className="form-check form-switch mb-3">
                                    <input
                                        onChange={({target}) => handleChangeObject(key, field, target.checked)}
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="flexSwitchCheckDefault"/>
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{capitalize(field)}</label>
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
        ))}
        </>
    );
}

export default AdminCreateForm;