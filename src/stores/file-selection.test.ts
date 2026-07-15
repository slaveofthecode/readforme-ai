import { describe, test, expect, beforeEach } from "bun:test";
import { useFileSelection } from "./file-selection";

describe("useFileSelection store", () => {
  beforeEach(() => {
    useFileSelection.getState().clearAll();
  });

  test("initializes with empty selection", () => {
    const state = useFileSelection.getState();
    expect(state.selectedFileIds).toEqual([]);
  });

  test("toggleFile adds file when not selected", () => {
    const { toggleFile } = useFileSelection.getState();
    toggleFile("file-1");
    expect(useFileSelection.getState().selectedFileIds).toEqual(["file-1"]);
  });

  test("toggleFile removes file when selected", () => {
    const { toggleFile } = useFileSelection.getState();
    toggleFile("file-1");
    toggleFile("file-1");
    expect(useFileSelection.getState().selectedFileIds).toEqual([]);
  });

  test("selectFile adds file only once", () => {
    const { selectFile } = useFileSelection.getState();
    selectFile("file-1");
    selectFile("file-1");
    expect(useFileSelection.getState().selectedFileIds).toEqual(["file-1"]);
  });

  test("deselectFile removes file", () => {
    const { selectFile, deselectFile } = useFileSelection.getState();
    selectFile("file-1");
    deselectFile("file-1");
    expect(useFileSelection.getState().selectedFileIds).toEqual([]);
  });

  test("selectAll replaces selection with all ids", () => {
    const { selectAll } = useFileSelection.getState();
    selectAll(["file-1", "file-2", "file-3"]);
    expect(useFileSelection.getState().selectedFileIds).toEqual([
      "file-1",
      "file-2",
      "file-3",
    ]);
  });

  test("clearAll removes all selections", () => {
    const { selectAll, clearAll } = useFileSelection.getState();
    selectAll(["file-1", "file-2"]);
    clearAll();
    expect(useFileSelection.getState().selectedFileIds).toEqual([]);
  });

  test("isSelected returns correct value", () => {
    const { selectFile, isSelected } = useFileSelection.getState();
    expect(isSelected("file-1")).toBe(false);
    selectFile("file-1");
    expect(isSelected("file-1")).toBe(true);
  });

  test("handles multiple file toggles", () => {
    const { toggleFile } = useFileSelection.getState();
    toggleFile("file-1");
    toggleFile("file-2");
    toggleFile("file-3");
    expect(useFileSelection.getState().selectedFileIds).toEqual([
      "file-1",
      "file-2",
      "file-3",
    ]);
    toggleFile("file-2");
    expect(useFileSelection.getState().selectedFileIds).toEqual([
      "file-1",
      "file-3",
    ]);
  });

  test("removeFiles removes specific ids from selection", () => {
    const { selectAll, removeFiles } = useFileSelection.getState();
    selectAll(["file-1", "file-2", "file-3"]);
    removeFiles(["file-2"]);
    expect(useFileSelection.getState().selectedFileIds).toEqual([
      "file-1",
      "file-3",
    ]);
  });

  test("removeFiles handles multiple ids", () => {
    const { selectAll, removeFiles } = useFileSelection.getState();
    selectAll(["file-1", "file-2", "file-3"]);
    removeFiles(["file-1", "file-3"]);
    expect(useFileSelection.getState().selectedFileIds).toEqual(["file-2"]);
  });

  test("removeFiles ignores ids not in selection", () => {
    const { selectAll, removeFiles } = useFileSelection.getState();
    selectAll(["file-1", "file-2"]);
    removeFiles(["file-99"]);
    expect(useFileSelection.getState().selectedFileIds).toEqual([
      "file-1",
      "file-2",
    ]);
  });
});
