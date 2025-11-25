"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  
  // Wait 500ms after user stops typing before triggering search
  const [debouncedValue] = useDebounce(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };

    const url = qs.stringifyUrl({
      url: '/search',
      query: query
    });

    router.push(url);
  }, [debouncedValue, router]);

  return ( 
    <Input 
      placeholder="What do you want to listen to?"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
   );
}
 
export default SearchInput;