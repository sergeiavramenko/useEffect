import React, {useEffect, useState} from "react";

import s from "./github.module.css"
import axios from "axios";
import exp from "constants";
import {clearInterval} from "timers";
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
type UsersListPropsType = {
    term: string
selectedUser: SearchUserType | null
    onUserSelect: (user: SearchUserType) => void
}
export  const UsersList = (props:UsersListPropsType) => {
    const [users, setUsers] = useState<SearchUserType[]>([])
    useEffect(() => {
    console.log("S")
    axios.get<SearchResult>(`https://api.github.com/search/users?q=${props.term}`).then(res => {
        setUsers(res.data.items)
    })
}, [props.term])
    return <ul>
    {users.map(u => <li key={u.id} className={props.selectedUser === u ? s.selected : ''}
                        onClick={() => {props.onUserSelect(u)
                            // document.title = u
                        }}>     {u.login}</li>)

    }
</ul>

}
type UserDetailsPropsList = {
user: SearchUserType | null

}
type TimerProps = {
seconds: number
    onChange:(actualSeconds: number) => void
}

export  const Timer = (props: TimerProps) => {
    const [seconds, setSeconds] = useState(props.seconds)
    useEffect(() => {
        setSeconds(props.seconds)
    }, [props.seconds] )
    useEffect(() => {
        props.onChange(seconds )
    }, [seconds] )
useEffect( () => {
const intervalId =  setInterval(() =>{setSeconds((prev )=> prev - 1 )

}, 1000  )

   
}, [] )


    return <div>
        {seconds}
    </div>

}
const startTimerSeconds  = 10
export  const UserDetails = (props:UserDetailsPropsList) => {
    const [userDetails, setUserDetails] = useState<null | UserType>(null)
    const [seconds, setSeconds] = useState(startTimerSeconds)

    useEffect(() => {
        console.log("Sync user details")
        if (!!props.user)
        {axios.get<UserType>(`https://api.github.com/users/${props.user.login}`).then(res => {
            setUserDetails(res.data)
            setSeconds(startTimerSeconds)
        })
        }
    }, [props.user])

    useEffect(() => {
        if (seconds < 1) {
            setUserDetails(null)
        }
    }, [seconds] )
 return <div>
     <div>


         {userDetails && <div> <Timer seconds={seconds} onChange={setSeconds } />
             <img src={userDetails.avatar_url} alt="ss"/>
             <br/>
             {userDetails.login}, followers: {userDetails.followers}</div> }
     </div>
 </div>
}




export function GitHub() {
    const [selectedUser, setselectedUser] = useState<SearchUserType | null>(null)
 /*   const [userDetails, setUserDetails] = useState<null | UserType>(null)*/
    /*const [users, setUsers] = useState<SearchUserType[]>([])*/
    let initialSearchState = "IT-kamasutra"
    /*const [tempSearch, setTempSearch] = useState('it-kamasutra')*/
    const [searchTerm, setSearchTerm] = useState(initialSearchState)

    useEffect(() => {
        console.log("cink")
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

  /*  useEffect(() => {
        console.log("Sync user details")
        if (!!selectedUser)
        {axios.get<UserType>(`https://api.github.com/users/${selectedUser.login}`).then(res => {
            setUserDetails(res.data)
        })
        }
    }, [selectedUser])*/


    return (
        <div className={s.container}>
            <div >
                <Search value={searchTerm} onSubmit={ (value: string) => {setSearchTerm(value) } }/>
                <button onClick={() => {setSearchTerm(initialSearchState)}   } >reset</button>
 <UsersList term={searchTerm} selectedUser={selectedUser} onUserSelect={  setselectedUser  }/>
            </div>
<UserDetails user={selectedUser} />

        </div>
    );
}

export default GitHub;
