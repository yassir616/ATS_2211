import { Button, Icon, Input } from "antd";
import React from "react";
import Highlighter from "react-highlight-words";

export const getColumnSearchProps = (dataIndex, nameToShow, context) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        ref={node => {
          context.searchInput = node;
        }}
        placeholder={`Recherche par ${nameToShow}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() =>
          context.handleSearch(selectedKeys, confirm, dataIndex)
        }
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Button
        type="primary"
        onClick={() => context.handleSearch(selectedKeys, confirm, dataIndex)}
        icon="search"
        size="small"
        style={{ width: 90, marginRight: 8 }}
      >
        Search
      </Button>
      <Button
        onClick={() => context.handleReset(clearFilters)}
        size="small"
        style={{ color: "white", width: 90, backgroundColor: "#ffc069" }}
      >
        Reset
      </Button>
    </div>
  ),

  filterIcon: filtered => (
    <div>
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    </div>
  ),

  onFilter: (value, record) =>
    record[dataIndex]
      .toString()
      .toLowerCase()
      .startsWith(value.toLowerCase()),

  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => context.searchInput.select());
    }
  },

  render: text =>
    context.state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[context.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ) : (
      text
    )
});
