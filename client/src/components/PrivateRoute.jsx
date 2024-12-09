import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom";

// export default function PrivateRoute() {
//     const {currentUser} = useSelector(state => state.user);
//   return currentUser ? <Outlet /> : <Navigate to='/sign-in' />
// }
export default function PrivateRoute({ allowedRoles =[] }) {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
      return <Navigate to="/sign-in" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
      return <Navigate to="/unauthorized" />; // Redirect if user lacks permissions
  }

  return <Outlet />;
}
