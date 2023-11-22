import "antd/dist/antd.css";

import { Input, Tree } from "antd";
import React, { Component } from "react";

const { TreeNode } = Tree;
const { Search } = Input;

const dataList = [];

const generateList = (data) => {
  for (let i of data) {
    const node = i;
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i of tree) {
    const node = i;
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

class SearchTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: [],
      searchValue: "",
      autoExpandParent: true,
      newData: [],
    };
  }

  componentDidMount() {
    this.prepareDataJsonFormat();
  }
  prepareDataJsonFormat() {
    let mynewDataHelper = [];
    this.props.Roles.forEach((element) => {
      let childData = [];
      element.privileges.forEach((privilege) => {
        let itemChild = { key: privilege.name, title: privilege.name };
        childData.push(itemChild);
      });
      let item = {
        key: element.name,
        title: element.name,
        children: childData,
      };
      mynewDataHelper.push(item);
    });
    this.setState({ newData: [...mynewDataHelper] });
    generateList(mynewDataHelper);
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, this.state.newData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = (data) =>
      data.map((item) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: "#f50" }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div>
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Rechercher"
          onChange={this.onChange}
        />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
        >
          {loop(this.state.newData)}
        </Tree>
      </div>
    );
  }
}

export default SearchTree;
