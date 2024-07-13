import { useState } from 'react';
import Node from './Node';
import UserNode from './UserNode';
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import userLogs from '../assets/userLogs.json';

function Flow() {
const initialNodes = [], initialEdges = [];
const selectedLogs = [];

//sort logs by created time
userLogs.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

//get all usernames
const userNames = userLogs.reduce((acc, item) => {
  if (!acc.includes(item.userName)) {
    acc.push(item.userName);
  }
  return acc;
}, []);

//add user nodes to initialNodes array
userNames.forEach((user, index) => {
  const lastLogin = userLogs.find(log => log.result === 'login' && log.userName === user);
  const lastLogout = userLogs.find(log => log.result === 'signout' && log.userName === user);
  initialNodes.push({
    id: user,
    data: {label: <UserNode userName={user} />}, 
    position: {x: 150, y: (index+1) * 205},
    count: 0,
    type: "output",
    targetPosition: "right",
    style: {
      width: "200px",
      height: "70px",
      border: "2px solid gray",
      borderRadius: "6px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "16px"
    }
  });
  selectedLogs.push(lastLogin, lastLogout);
  initialEdges.push({
    id: user+"1",
    source: user,
    target: user + "1",
    animated: true
  })
  initialEdges.push({
    id: user + "e1-2",
    source: user + "1",
    target: user + "2",
    animated: true
  });
})

//add logs node
selectedLogs.forEach((log, index) => {
    const user = initialNodes.find(item => item.id == log.userName);
    user.count++;
    const positionY = user.position.y;
    initialNodes.push({
        id: user.id+user.count, 
        type: 'custom',
        data: {label: <Node userLog={selectedLogs[index]} />}, 
        position: { y: positionY, x: ((user.count + 1) * 300) - 150},
        sourcePosition: 'right',
        targetPosition: 'left',
        style: {
            width: "200px",
            height: "70px",
            fontSize: "13px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid #cc33ff",
            borderRadius: "6px",
            visibility: "visible"
        }
    });
  })
    
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  return (
      <ReactFlow
        nodes={nodes}
        edges={edges}
      />
  );
}

export default Flow;