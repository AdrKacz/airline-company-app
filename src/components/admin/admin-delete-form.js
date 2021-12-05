import { capitalize } from './capitalize';

function AdminDeleteForm({databaseSchema, handleSubmitDeleteObject, handleChangeObject, editedObject, objects}) {
    return (
        <>
        {Object.entries(databaseSchema).map(([key, value], i) => (
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
            ))}
        </>
    );
}

export default AdminDeleteForm;