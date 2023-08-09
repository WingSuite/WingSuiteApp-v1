// React Icons
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React import
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import React from "react";

// Tree import
import { TreeChart } from "@/components/treeGraph";

export default function MyTree() {
  const treeData = [
    {
      name: "25th Cadet Wing",
      children: [
        {
          name: "Mission Support Group",
          children: [
            {
              name: "Add Unit",
              attributes: {
                test: "Test"
              }
            },
          ],
        },
        {
          name: "Wing Staff",
          children: [
            {
              name: "Team 1",
              children: [
                {
                  name: "Add Unit",
                },
              ],
            },
            {
              name: "Team 2",
              children: [
                {
                  name: "Add Unit",
                },
              ],
            },
            {
              name: "Add Unit",
            },
          ],
        },
        {
          name: "Operations Training Group",
          children: [
            {
              name: "POC Squadron",
              children: [
                {
                  name: "Add Unit",
                },
              ],
            },
            {
              name: "FTP Squadron",
              children: [
                {
                  name: "Echo Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Foxtrot Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Golf Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Hotel Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Add Unit",
                },
              ],
            },
            {
              name: "IMT Squadron",
              children: [
                {
                  name: "Alpha Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Bravo Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Charlie Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Delta Flight",
                  children: [
                    {
                      name: "Add Unit",
                    },
                  ],
                },
                {
                  name: "Add Unit",
                },
              ],
            },
            {
              name: "Add Unit",
            },
          ],
        },
        {
          name: "Add Unit",
        },
      ],
    },
  ];

  return (
    <div className="">
      <div className="tree-container">
        <TreeChart treeData={treeData} addUnitFunc={(e) => e} />
      </div>
    </div>
  );
}
