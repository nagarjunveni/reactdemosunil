import React from "react";
import QueryBuilder from "react-querybuilder";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import {Tabs, Tab} from 'react-bootstrap-tabs';
import "./App.css";


const customization = {
  fields: {
    title: "Attributes"
  },
  operators: {
    title: "Operators"
  },
  value: {
    title: "Value"
  },
  removeRule: {
    label: "x",
    title: "Remove rule"
  },
  removeGroup: {
    label: "X",
    title: "Remove Set"
  },
  addRule: {
    label: "+RULE",
    title: "Add A Rule"
  },
  addGroup: {
    label: "+SET",
    title: "Add a SET"
  },
  combinators: {
    title: "Combinators"
  }
};

const customelement = {
  valueEditor: returnsearchcomponent
};

const styles = {
  queryBuilder: "query-builder", // Root <div> element

  ruleGroup: "rules-group-container", // <div> containing the RuleGroup
  combinators: String, // <select> control for combinators
  addRule: "btn-success", // <button> to add a Rule
  addGroup: "btn-success", // <button> to add a RuleGroup
  rule: "rule-placeholder",
  removeRule: "btn-danger",
  removeGroup: "btn-danger"
};

function returnsearchcomponent(props) {
  if (props.field === "Group") {
    return <CustomerFilter {...props} />;
  } else if (props.field === "BillTo")
    return (
      <input
        type="text"
        onChange={e => {
          props.handleOnChange(e.target.value);
        }}
      />
    );
  else if (props.field === "ItemNo") return <ItemFilter {...props} />;
  else if (props.field === "ItemCategory")
    return (
      <input
        type="text"
        onChange={e => {
          props.handleOnChange(e.target.value);
        }}
      />
    );
  else if (props.field === "isParent")
    return (
      <input
        type="checkbox"
        id="cb"
        onClick={e => {
          if (e.target.checked) props.handleOnChange(true);
          else props.handleOnChange(false);
        }}
      />
    );
  else if (props.field === "Name") return <CustomerFilter {...props} />;
  else
    return (
      <input
        type="text"
        onChange={e => {
          props.handleOnChange(e.target.value);
        }}
      />
    );

  // return <input type="text"  onChange={(e)=>{props.handleOnChange(e.target.value)}} />
}

//const fields= [{name:"Group", label:"Group"}]

class QueryBuild extends React.Component {
  constructor(props) {
    super(props);

    this.showQuery = this.showQuery.bind(this);
    this.getAttributes = this.getAttributes.bind(this);
    
    
    //TODO shift this to env variable
    let config = {};
    if (process.env.REACT_APP_MPH_CONFIG) {
      config = JSON.parse(process.env.REACT_APP_MPH_CONFIG);
    }


    this.state = { config: config, cust_queryarray: [], item_queryarray: [] };
    this.customerFields = this.getAttributes("Customer");
    this.customFields = [...this.customerFields];
    this.materialFields = this.getAttributes("Material");
    console.log('this.customerFields', this.customerFields)
    console.log('this.materialFields', this.materialFields)
  }

  getAttributes(type) {
    const configobj = this.state.config;
    const attributearray = configobj["attributes"];
    let fieldarray = attributearray
      .map(obj => {
        if (obj["type"] === type) {
          let fieldlabel = obj["name"];
          let fieldname = obj["id"];

          return { name: fieldname, label: fieldlabel };
        } else {
          return null;
        }
      })
      .filter(obj => obj !== null);

      console.log('fieldarray ', fieldarray)
    return fieldarray;
  }

  showQuery(query, type) {
    // console.log(this.state.queryarray)

    // console.log(newarray)
    if (type === "Customer") {
      let newarray = this.state.cust_queryarray.concat(query);
      this.setState({ cust_queryarray: newarray });
    } else if (type === "Item") {
      let newarray = this.state.item_queryarray.concat(query);
      this.setState({ item_queryarray: newarray });
    }
  }

  render() {
    //TODO use Item attributes here
    return (
      <div>
        <Tabs onSelect={(index, label) => {
            console.log(label + ' selected');
            // this.materialFields = [...this.materialFields];
            // this.customerFields = [...this.customerFields];
            console.log(' index ',index);
            if(index == 0){
              
              this.customFields = [...this.customerFields];
            }else{
              this.customFields = [...this.materialFields];  
            }
            // // this.forceUpdate();
            //  this.setState({index: index})
            //  this.forceUpdate();
          }} selected={this.state.index}>
          <Tab label="Tab1">
          <div>
            Testing 1
            <QueryBuilder 
              fields={this.customFields}
              controlElements={customelement}
              controlClassnames={styles}
              onQueryChange={obj => this.showQuery(obj, "Customer")}
              translations={customization}
            />

            <Showquery query={this.state.cust_queryarray} />
          </div>

          
          </Tab>
          <Tab label="Tab2">
          <div>
            Test 2
            <QueryBuilder
              fields={this.customFields}
              controlElements={customelement}
              controlClassnames={styles}
              onQueryChange={obj => this.showQuery(obj, "Item")}
              translations={customization}
            />
            <Showquery query={this.state.item_queryarray} />
          </div>
          
          </Tab>
        </Tabs>
        
        


        <div className="col-lg-4 col-lg-offset-4">
          <label>Case#</label>
          <input type="text" placeholder="type your case" />
        </div>
        <div className="container-query ">
         
         
        </div>
      </div>
    );
  }
}

const Showquery = props => {
  let lastobject = JSON.stringify(props.query[props.query.length - 1]);
  return <p className="p-style">{lastobject}</p>;
};

const Options = ["CVS Pharmacy", "Walgreens", "Walmart", "Rite Aid"];
const Itemoptions = ["omniprezole", "paracetamol", "mortrin", "acetaminophen"];
const CustomerFilter = props => {
  var selected = [];
  // console.log("field is:"+ props.field)

  return (
    <Typeahead
      // TODO research when API is done on this onSearch={this.handleSearch}
      clearButton
      multiple
      limit
      options={Options}
      clear
      onChange={s => {
        selected = s;
        props.handleOnChange(selected);
      }}
      placeholder="Select a Value..."
    />
  );
};

const ItemFilter = props => {
  var selected = [];
  // console.log("field is:"+ props.field)

  return (
    <Typeahead
      // TODO research when API is done on this onSearch={this.handleSearch}
      clearButton
      multiple
      limit
      options={Itemoptions}
      clear
      onChange={s => {
        selected = s;
        props.handleOnChange(selected);
      }}
      placeholder="Select a Value..."
    />
  );
};

export default QueryBuild;
