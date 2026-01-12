
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Checkbox } from '../../../ui/checkbox'; 
import { Label } from '../../../ui/label';

function UserListHeader({}: any) {
    const [isActive, setIsActive] = useState<boolean | null>(null);
    const downloadLinks = [
        "User Details",
        "User Access Group Records",
        "User Product Interest Records",
        "Account Status Report",
    ];
    return (
    <div className="mt-2 bg-white mb-2">
        <div className='filter-title'>
            <Label htmlFor="lbl">User Search</Label>
        </div>
        <div className='w-full flex items-center gap-4'>
            <div className='w-36'>
                <Select className="w-48"  >
                <SelectTrigger className="w-full h-32 py-1" size="sm">
                    <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="firstName">First Name</SelectItem>
                    <SelectItem value="lastName">Last Name</SelectItem>  
                    <SelectItem value="email">Email</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div>
                <Input id="search" type="text" placeholder="Search ..."  className='h-8 py-1'/>
            </div>
            <div className="flex items-center gap-2 w-32">
                <Checkbox
                    id="status"
                    checked={isActive}
                    onCheckedChange={(checked:any) => setIsActive(!!checked)}
                />
                <label htmlFor="status" className="text-sm cursor-pointer mb-0">
                    {isActive ? "Show Active" : "Show Inactive"}
                </label>
            </div>
            <div>
                <Button className='bg-blue-600 text-white px-4 py-1 h-8 text-sm cursor-pointer'>Search</Button>  
            </div>
        </div>
        {/* Download to Excel */}


            <div className="download-links flex items-center gap-2 text-sm mb-2 mt-2">
                <span className="font-semibold">Download to Excel:</span>

                <ul className="flex items-center list-none p-0 m-0 gap-1">
                    {downloadLinks.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <a href="#" className="text-blue-500 hover:underline">
                        {item}
                        </a>
                        {index < downloadLinks.length - 1 && (
                        <span className="mx-1">|</span>
                        )}
                    </li>
                    ))}
                </ul>
                </div>

    </div>
  );
}

export default UserListHeader;

