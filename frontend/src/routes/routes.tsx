import { createBrowserRouter } from 'react-router-dom';
import AddInquiry from '../components/AddInquiry';

const routes = createBrowserRouter([{ path: '/', element: <AddInquiry /> }]);

export default routes;
