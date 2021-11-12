import { useState } from 'react';

function useRedeems() {
  const [redeems, setRedeems] = useState([]);

  function addRedeem(redeem) {
    setRedeems([...redeems, {
      code: redeem.toUpperCase(),
      discount: 5 + Math.floor(Math.random() * 10),
    }]);
  }

  return [redeems, addRedeem];
}

export default useRedeems;
