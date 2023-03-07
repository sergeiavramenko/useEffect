import React, {useEffect, useState} from "react";

import s from "./github.module.css"
import axios from "axios";
type UserType = {
    login:string
    id:number
    avatar_url:string
    followers: number
}
type SearchUserType = {
    login: string
    id: number
}
type SearchResult = {
    items: SearchUserType[]

}
type SearchPropsType = {
    value: string
    onSubmit: (fixedValue: string) => void
}

export  const Search = (props: SearchPropsType) => {
    const [tempSearch, setTempSearch] = useState('')
useEffect(() => {
    setTempSearch(props.value)
} , [props.value] )

return (
    <div>
        <input placeholder="search"
               value={tempSearch}
               onChange={(e) => {
                   setTempSearch(e.currentTarget.value)
               }}
        />
        <button onClick={() => {
            props.onSubmit(tempSearch)

        }}>find
        </button>
    </div>
)

}





export function GitHub() {
    const [selectedUser, setselectedUser] = useState<SearchUserType | null>(null)
    const [userDetails, setUserDetails] = useState<null | UserType>(null)
    const [users, setUsers] = useState<SearchUserType[]>([])
    let initialSearchState = "IT-kamasutra"
    /*const [tempSearch, setTempSearch] = useState('it-kamasutra')*/
    const [searchTerm, setSearchTerm] = useState(initialSearchState)

    useEffect(() => {
        console.log("cink")
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])
    useEffect(() => {
        console.log("S")
        axios.get<SearchResult>(`https://api.github.com/search/users?q=${searchTerm}`).then(res => {
            setUsers(res.data.items)
        })
    }, [searchTerm])
    useEffect(() => {
        console.log("Sync user details")
        if (!!selectedUser)
        {axios.get<UserType>(`https://api.github.com/users/${selectedUser.login}`).then(res => {
            setUserDetails(res.data)
        })
        }
    }, [selectedUser])


    return (
        <div className={s.container}>
            <div >
                <Search value={searchTerm} onSubmit={ (value: string) => {setSearchTerm(value) } }/>
                <button onClick={() => {setSearchTerm(initialSearchState)}   } >reset</button>

               {/* <div>
                <input placeholder="search"
                       value={tempSearch}
                       onChange={(e) => {
                           setTempSearch(e.currentTarget.value)
                       }}
                />
                <button onClick={() => {
                   setSearchTerm(tempSearch)

                }}>find
                </button>
            </div>*/}

                <ul>
                    {users.map(u => <li key={u.id} className={selectedUser === u ? s.selected : ''}
                                        onClick={() => {
                                            setselectedUser(u)
                                            // document.title = u
                                        }}>     {u.login}</li>)

                    }
                </ul>
            </div>
            <div>
                <h2>Username</h2>
                {userDetails && <div>
                    <img src={userDetails.avatar_url} alt="ss"/>
                    <br/>
                    {userDetails.login}, followers: {userDetails.followers}</div> }
            </div>
        </div>
    );
}

export default GitHub;
