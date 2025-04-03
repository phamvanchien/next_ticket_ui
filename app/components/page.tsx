"use client"
import AvatarName from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import Dropdown from "@/common/components/Dropdown";
import Input from "@/common/components/Input";
import SelectMultiple from "@/common/components/SelectMultiple";
import SelectSingle from "@/common/components/SelectSingle";
import UserGroup from "@/common/components/UserGroup";
import Sidebar from "@/common/layouts/Sidebar";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, MenuProps, SelectProps, Spin } from "antd";
import Image from "next/image";

const ComponentPage = () => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  const options: SelectProps['options'] = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }
  return <>
    <div className="row">
      <div className="col-12">
        <h2>Button</h2>
      </div>
      <div className="col-12">
        <Button className="ml-2" color="primary">
        primary
        </Button>
        <Button disabled className="ml-2" color="warning">
        warning
        </Button>
        <Button className="ml-2" color="danger">
          danger
        </Button>
        <Button className="ml-2" color="light">
          light
        </Button>
        <Button className="ml-2" color="info">
          info
        </Button>
        <Button className="ml-2" color="success">
          success
        </Button>
        <Button className="ml-2" color="dark">
          dark
        </Button>
        <Button className="ml-2" color="secondary">
          secondary
        </Button>
        <Button className="ml-2" color="default">
        default
        </Button>
      </div>
      <div className="col-12 mt-2">
        <Button outline className="ml-2" color="primary">
        primary
        </Button>
        <Button outline disabled className="ml-2" color="warning">
        warning
        </Button>
        <Button outline className="ml-2" color="danger">
          danger
        </Button>
        <Button outline className="ml-2" color="light">
          light
        </Button>
        <Button outline className="ml-2" color="info">
          info
        </Button>
        <Button outline className="ml-2" color="success">
          success
        </Button>
        <Button outline className="ml-2" color="dark">
          dark
        </Button>
        <Button outline className="ml-2" color="secondary">
          secondary
        </Button>
        <Button outline className="ml-2" color="default">
        default
        </Button>
      </div>
      <div className="col-12 mt-2">
        <hr/>
        <Button color="light" className="d-flex align-items-center shadow-sm border rounded-pill px-4 py-2">
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" className="me-2" width="24" height="24" />
          <span className="">Sign in with Google</span>
        </Button>
      </div>
      <div className="col-12 mt-2">
        <hr/>
        <Dropdown items={items}>
          Dropdown
        </Dropdown>
      </div>
      <div className="col-12 mt-2">
        <hr/>
        <AvatarName name="Chiến" />
        <p>
        <UserGroup>
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
          <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
          <Avatar style={{ backgroundColor: '#f56a00' }}>E</Avatar>
        </UserGroup>
        </p>
      </div>
    </div>
    <div className="row mt-2">
      <div className="col-4">
      <hr/>
        <Input type="text" placeholder="Enter text" />
        <Input type="password" classGroup="mt-2" placeholder="Enter text" />
        <Input type="text" classGroup="mt-2" icon={<FontAwesomeIcon icon={faEnvelope} />} placeholder="Enter text" />
        <Input type="text" placeholder="Enter text" classGroup="mt-2" errorMessage="Please enter name" />
        <SelectMultiple className="mt-2" placeholder="Select items" options={options} defaultValues={['a10', 'c12']} />
        <SelectSingle className="mt-2" options={[
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
          { value: 'Yiminghe', label: 'yiminghe' },
          { value: 'disabled', label: 'Disabled', disabled: true },
        ]} defaultValue={'jack'} />
        <Spin tip="Loading" spinning={true}>
          <SelectMultiple className="mt-2" placeholder="Select items" options={options} defaultValues={['a10', 'c12']} />
          <SelectSingle className="mt-2" options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
          ]} defaultValue={'jack'} />
        </Spin>
        {/* <Sidebar /> */}
      </div>
    </div>
    <div className="row">
      <div className="col-12">
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "350px" }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <Image src="/logo-3.png" alt="Logo" width={170} height={60} />
        </div>

        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>

        {/* Continue Button */}
        <button className="btn btn-primary w-100 mb-2">Continue</button>

        {/* OR Divider */}
        <div className="text-center text-muted mb-2">or</div>

        {/* Login with Google */}
        <button className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center">
          <FontAwesomeIcon icon={faGoogle} className="me-2 text-danger" />
          Login with Google
        </button>
      </div>
    </div>
      </div>
    </div>
  </>
}
export default ComponentPage;