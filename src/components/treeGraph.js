// React Icons
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React import
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import React from "react";

// Tree import
const Tree = dynamic(() => import("react-d3-tree"), {
  ssr: false,
});

// Tree component definition
export function TreeChart({
  treeData,
  updateUnitFunc = () => {},
  addUnitFunc = null,
}) {
  // Define useStates and ref information
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef();

  // Calculate width and height of a given container
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [containerRef]);

  // Calculate origin based on tree size
  const xTranslate = dimensions.width / 2;
  const yTranslate = dimensions.height / 3;

  // Render custom object on the graph
  const renderForeignObjectNode = ({ nodeDatum, toggleNode }) => {
    return (
      <>
        {nodeDatum.children != undefined && (
          <>
            <foreignObject
              width={120}
              height={100}
              x={-60}
              y={-1}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                className="h-fit w-full rounded-lg border border-sky
                bg-sky bg-gradient-to-tr from-deepOcean to-sky p-1
                text-center text-sm text-white hover:border-darkOcean"
                onClick={() => updateUnitFunc(nodeDatum)}
              >
                {nodeDatum.name}
              </button>
            </foreignObject>
            <foreignObject width={30} height={30} y={-17} x={53}>
              <button onClick={toggleNode}>
                {!nodeDatum["__rd3t"].collapsed && (
                  <IconContext.Provider value={{ size: "1.4em" }}>
                    <VscEye />
                  </IconContext.Provider>
                )}
                {nodeDatum["__rd3t"].collapsed && (
                  <IconContext.Provider value={{ size: "1.4em" }}>
                    <VscEyeClosed />
                  </IconContext.Provider>
                )}
              </button>
            </foreignObject>
          </>
        )}
        {nodeDatum.children == undefined && addUnitFunc && (
          <foreignObject
            width={100}
            height={44}
            x={-50}
            y={-5}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="p-1"
          >
            <button
              className="h-fit w-full rounded-lg border border-transparent
              bg-white p-1 text-center text-sm text-sky transition
              duration-200 ease-in hover:-translate-y-[0.1rem]
              hover:border-sky hover:shadow-md hover:shadow-sky"
              onClick={() => addUnitFunc(nodeDatum)}
            >
              {nodeDatum.name}
            </button>
          </foreignObject>
        )}
      </>
    );
  };

  // Render the graph
  return (
    <div className="tree-wrapper" ref={containerRef}>
      <Tree
        instanceId={"TREE"}
        data={treeData}
        separation={{ nonSiblings: 1, siblings: 1 }}
        translate={{ x: xTranslate, y: yTranslate }}
        orientation="vertical"
        pathFunc="step"
        maxWidth={null}
        maxHeight={null}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps })
        }
      />
    </div>
  );
}
