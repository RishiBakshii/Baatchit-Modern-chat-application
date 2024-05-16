import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { Loader } from './components/shared/Loader';
import { Protected } from './components/auth/Protected';
import { useUpdateLogin } from './hooks/useAuth/useUpdateLogin';
import { RootLayout } from './components/layout/RootLayout';
import { ChatPage, LoginPage, SignupPage } from './pages';
import { useCheckAuthQuery } from './services/api/authApi';

export const App = () => {

  const {isSuccess,data,isFetching}=useCheckAuthQuery()
  
  useUpdateLogin(isSuccess,data)

  const router = createBrowserRouter(createRoutesFromElements(

    <>
    <Route path='/' element={<Protected><RootLayout/></Protected>}>
        <Route index element={<ChatPage/>}/>
    </Route>
    <Route path='/signup' element={<Protected authorized={false}><SignupPage/></Protected>}/>
    <Route path='/login' element={<Protected authorized={false}><LoginPage/></Protected>}/>
    </>

  ));

  return (
    isFetching? <Loader/>:
    <RouterProvider router={router}/>
  )
};
