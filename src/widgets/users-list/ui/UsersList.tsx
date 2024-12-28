import { UsersList as _UsersList } from "@/entities/user";
import useUsersList from "@/entities/user/api/users-list";

export default function UsersList({}) {
  const { usersList, isUsersListLoading } = useUsersList({ condition: true });

  return (
    <>
      <_UsersList data={usersList} isLoading={isUsersListLoading} />
    </>
  );
}
