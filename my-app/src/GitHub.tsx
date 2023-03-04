import React, {useEffect, useState} from "react";

 import s from "./github.module.css"
function GitHub() {
    const [selectedUser, setselectedUser] = useState<string | null>(null)

useEffect(() => {
    console.log("cink")
    if (selectedUser) {
        document.title = selectedUser
    }
}, [selectedUser])


    return (
        <div >
          <div className={s.container}>
              <input placeholder="search" /> <button>find</button>
              <ul>
                  {  ['dimych' , 'artem'].map(u  => <li className={selectedUser === u ? s.selected : ''}
                                                        onClick={ () => {
                                                            setselectedUser(u)
                                                           // document.title = u
                                                        } } >     {u}</li> )

                  }
              </ul>
          </div>
            <div>
                <h2>Username</h2>
                <div>Details</div>
            </div>
        </div>
    );
}

export default GitHub;
