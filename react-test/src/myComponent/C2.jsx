import { Input } from 'antd';
import React, { useState } from 'react';

const C2 = () => {
    const [input, setInput] = useState(null);
    return(
        <div>
            <Input onChange={(e) => {setInput(e.target.value)}} value={input} placeholder="Basic usage" />
        </div>

    );
}

export default C2;