// SPDX-License-Identifier: Apache-2.0

/*
  Sample Chaincode based on Demonstrated Scenario

 This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/fabcar/fabcar.go
*/

package main

/* Imports
* 4 utility libraries for handling bytes, reading and writing JSON,
formatting, and string manipulation
* 2 specific Hyperledger Fabric specific libraries for Smart Contracts
*/
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/* Define Tuna structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type Tuna struct {
	Vessel    string `json:"vessel"`
	Timestamp string `json:"timestamp"`
	location  string `json:"location"`
	Holder    string `json:"holder"`
}

/* Define Bottle structure, with 4 properties.
Structure tags are used by encoding/json library
*/
type Bottle struct {
	Used       string `json:"used"`
	Date       string `json:"date"`
	Holder     string `json:"holder"`
	Holdertype string `json:"holdertype"`
}

/*
 * The Init method *
 called when the Smart Contract "tuna-chaincode" is instantiated by the network
 * Best practice is to have any Ledger initialization in separate function
 -- see initLedger()
*/
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method *
 called when an application requests to run the Smart Contract "tuna-chaincode"
 The app also specifies the specific smart contract function to call with args
*/
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger
	if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordBottle" {
		return s.recordBottle(APIstub, args)
	} else if function == "queryAllBottles" {
		return s.queryAllBottles(APIstub)
	} else if function == "changeBottleHolder" {
		return s.changeBottleHolder(APIstub, args)
	} else if function == "queryBottle" {
		return s.queryBottle(APIstub, args)
	} else if function == "changeBottleUsed" {
		return s.changeBottleUsed(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

/*
 * The queryTuna method *
Used to view the records of one particular tuna
It takes one argument -- the key for the tuna in question
*/
func (s *SmartContract) queryTuna(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	tunaAsBytes, _ := APIstub.GetState(args[0])
	if tunaAsBytes == nil {
		return shim.Error("Could not locate tuna")
	}
	return shim.Success(tunaAsBytes)
}

/*
 * The queryBottle method *
Used to view the records of one particular Bottle
It takes one argument -- the key for the Bottle in question
*/
func (s *SmartContract) queryBottle(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	bottleAsBytes, _ := APIstub.GetState(args[0])
	if bottleAsBytes == nil {
		return shim.Error("Could not locate Bottle")
	}
	return shim.Success(bottleAsBytes)
}

/*
 * The initLedger method *
Will add test data (10 bottle catches)to our network
*/
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	bottle := []Bottle{
		Bottle{Used: "Sim", Date: "10102018", Holdertype: "Consumidor", Holder: "14890991077"},
		Bottle{Used: "Não", Date: "14012018", Holdertype: "Fábrica", Holder: "76445977006"},
		Bottle{Used: "Sim", Date: "02112018", Holdertype: "Coleta", Holder: "08852952004"},
		Bottle{Used: "Sim", Date: "27122018", Holdertype: "Consumidor", Holder: "76684899081"},
		Bottle{Used: "Não", Date: "09082018", Holdertype: "Estabelecimento", Holder: "19300558030"},
		Bottle{Used: "Não", Date: "30092018", Holdertype: "Fábrica", Holder: "50450805042"},
		Bottle{Used: "Sim", Date: "10102018", Holdertype: "Consumidor", Holder: "40690551002"},
		Bottle{Used: "Não", Date: "26102018", Holdertype: "Estabelecimento", Holder: "02443785092"},
		Bottle{Used: "Sim", Date: "22052019", Holdertype: "Coleta", Holder: "40540879061"},
		Bottle{Used: "Não", Date: "10042019", Holdertype: "Fábrica", Holder: "21178679012"},
	}

	i := 0
	for i < len(bottle) {
		fmt.Println("i is ", i)
		bottleAsBytes, _ := json.Marshal(bottle[i])
		APIstub.PutState(strconv.Itoa(i+1), bottleAsBytes)
		fmt.Println("Added", bottle[i])
		i = i + 1
	}

	return shim.Success(nil)
}

/*
 * The recordBottle method *
Fisherman like Sarah would use to record each of her tuna catches.
This method takes in five arguments (attributes to be saved in the ledger).
*/
func (s *SmartContract) recordBottle(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}

	var bottle = Bottle{Used: args[1], Date: args[2], Holdertype: args[3], Holder: args[4]}

	bottleAsBytes, _ := json.Marshal(bottle)
	err := APIstub.PutState(args[0], bottleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record bottle: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The queryAllBottles method *
allows for assessing all the records added to the ledger(all tuna catches)
This method does not take any arguments. Returns JSON string containing results.
*/
func (s *SmartContract) queryAllBottles(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllBottles:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

/*
 * The changeBottleHolder method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, tuna id and new holder name.
*/
func (s *SmartContract) changeBottleHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Printf("Chegou aqui")
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	bottleAsBytes, _ := APIstub.GetState(args[0])
	if bottleAsBytes == nil {
		return shim.Error("Could not locate bottle")
	}
	bottle := Bottle{}

	json.Unmarshal(bottleAsBytes, &bottle)
	// Normally check that the specified argument is a valid holder of bottle
	// we are skipping this check for this example
	bottle.Holder = args[1]
	bottle.Holdertype = args[2]

	bottleAsBytes, _ = json.Marshal(bottle)
	err := APIstub.PutState(args[0], bottleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change bottle holder: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * The changeBottleUsed method *
The data in the world state can be updated with who has possession.
This function takes in 2 arguments, tuna id and new holder name.
*/
func (s *SmartContract) changeBottleUsed(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	bottleAsBytes, _ := APIstub.GetState(args[0])
	if bottleAsBytes == nil {
		return shim.Error("Could not locate bottle")
	}
	bottle := Bottle{}

	json.Unmarshal(bottleAsBytes, &bottle)
	// Normally check that the specified argument is a valid holder of bottle
	// we are skipping this check for this example
	bottle.Used = args[1]

	bottleAsBytes, _ = json.Marshal(bottle)
	err := APIstub.PutState(args[0], bottleAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change bottle used: %s", args[0]))
	}

	return shim.Success(nil)
}

/*
 * main function *
calls the Start function
The main function starts the chaincode in the container during instantiation.
*/
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
