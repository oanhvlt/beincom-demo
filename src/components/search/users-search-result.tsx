import { useRouter } from "next/navigation";

interface IUsers {
    users: UserType[];
}

const UsersSearchResults = (props: IUsers) => {
    const { users } = props;
    const router = useRouter();
    return (
        <div className="flex flex-col gap-5 mt-7">
            {users.map((user) => (
                <div key={user._id}
                    className="bg-gray-100 rounded p-2 flex gap-5 items-center 
                                border border-solid border-gray-300 cursor-pointer"
                    onClick={() => router.push(`/profile/${user._id}`)}
                >
                    <div>
                        <img
                            src={user.profilePic}
                            alt="profile"
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                    <div>
                        <span className="font-bold text-sm">{user.name}</span>

                        <div className="flex gap-5">
                            <span className="text-xs">{user.email}</span>
                        </div>
                    </div>
                </div>
            ))

            }
        </div>
    )
}

export default UsersSearchResults;