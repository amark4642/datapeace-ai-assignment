import React, { useEffect, useState } from "react";

var globalArray;

export default function Main() {
    const [arr, setArr] = useState([]);
    const [view, setView] = useState(false);
    const [userdata, setUserdata] = useState({});
    const [pageNo, setPageNo] = useState(0);
    const [input, setInput] = useState('');
    useEffect(() => {
        fetch(`https://datapeace-storage.s3-us-west-2.amazonaws.com/dummy_data/users.json`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setArr(data)
                globalArray = data;
                setPageNo(1);
            })
    }
        , [])
    const clickfn = () => {
        if (input === '') {
            setArr(globalArray);
            return;
        };
        setPageNo(1);
        const temp = globalArray.filter(user => user.first_name.toLowerCase().includes(input));
        if (temp.length < 1) {
            alert('Oops! No such data exist !')
            return;
        }
        setArr(temp);
        console.log(temp)
    }
    const back = () => {
        setView(false)
    }
    const onTableClick = (user) => {
        setView(true);
        setUserdata(user);
        console.log(user);
    }

    const next = () => {
        if (pageNo >= arr.length / 10) { alert('no data beyond this page !'); return; }
        setPageNo((p) => p + 1)
    }
    const prev = () => {
        if (pageNo <= 1) { alert('no data beyond this page !'); return; }
        setPageNo((p) => p - 1)
    }
    return (

        <>
            <div style={{ 'textAlign': 'left', 'margin': '2rem', 'marginTop': '0px' }}>
                <h1>Users Data</h1>
                <input onChange={(e) => { setInput(e.target.value); if (input.length == 1) { setArr(globalArray) } }} type={'text'} />
                <button onClick={clickfn}>Search</button>
            </div>
            <div id="display">
                <div>
                    <table style={view ? { 'width': '70%' } : { 'width': '142%' }}>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                        <th>Email</th>
                        <th>Website</th>
                        {arr.map((user, idx) => {
                            return (
                                idx < 10 * pageNo && idx >= 10 * (pageNo - 1) ?
                                    <tr onClick={() => { onTableClick({ user }) }}>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.age}</td>
                                        <td>{user.email}</td>
                                        <td >{user.web}</td>
                                    </tr> : null
                            )
                        })}
                    </table>
                    <div className="temp" >
                        <button onClick={prev}>Previous</button>
                        Page No : {pageNo} of {arr.length / 10}
                        <button onClick={next}>Next</button>
                    </div>
                </div>
                {view ? <div style={{ 'fontWeight': 'bold', 'border': '2px solid black', 'borderRadius': '5px', 'textAlign': 'left', 'backgroundColor': 'cornflowerblue', 'padding': '5px' }}>
                    <button className="cross" onClick={back}>X</button><br></br><br></br>
                    First Name : {userdata.user.first_name}<br></br>
                    Last Name : {userdata.user.last_name}<br></br>
                    Company : {userdata.user.company_name}<br></br>
                    City : {userdata.user.city}<br></br>
                    State : {userdata.user.state}<br></br>
                    Zip : {userdata.user.zip}<br></br>
                    Age : {userdata.user.age}<br></br>
                    Email : {userdata.user.email}<br></br>
                    Website : <a href={userdata.user.web} target="_blank" >Click to open</a>

                </div> : null}
            </div>
        </>
    )
}